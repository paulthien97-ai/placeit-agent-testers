"""Mở game trên máy ảo, nối DevTools của WebView (bản debug), ghi mọi lỗi JS / console từ lúc tải lại trang, chạm BẮT ĐẦU, chụp màn.
Không dùng AI. Kết quả: out/console.json, out/*.png (chụp bằng adb), out/logcat.txt (bước workflow).
"""
import json, os, subprocess, sys, time, urllib.request
import websocket  # pip install websocket-client

APP = os.environ.get("APP_ID", "com.placeitgently.game")
OUT = "out"; os.makedirs(OUT, exist_ok=True)
def adb(*a): return subprocess.run(["adb", *a], capture_output=True, text=True).stdout
def shot(name): subprocess.run(f"adb exec-out screencap -p > {OUT}/{name}.png", shell=True)

adb("shell", "am", "start", "-n", f"{APP}/.MainActivity") if "MainActivity" in adb("shell", "cmd", "package", "resolve-activity", "--brief", APP) else adb("shell", "monkey", "-p", APP, "1")
adb("shell", "svc", "power", "stayon", "true"); adb("shell", "input", "keyevent", "KEYCODE_WAKEUP"); adb("shell", "wm", "dismiss-keyguard")
sock = None
for _ in range(60):
    time.sleep(2)
    s = adb("shell", "cat", "/proc/net/unix")
    pid = adb("shell", "pidof", APP).strip()
    names = sorted({l.split("@")[-1].strip() for l in s.splitlines() if "devtools_remote" in l and (not pid or l.strip().endswith("_" + pid))})
    if names: sock = names[-1]; break
print("socket", sock)
if not sock: sys.exit("no devtools socket")
adb("forward", "tcp:9222", f"localabstract:{sock}")
pages = []
for _ in range(30):
    try: pages = [p for p in json.load(urllib.request.urlopen("http://127.0.0.1:9222/json")) if p.get("type") == "page" and "index.html" in p.get("url", "")]
    except Exception: pages = []
    if pages: break
    time.sleep(1)
ws = websocket.create_connection(pages[0]["webSocketDebuggerUrl"], timeout=5)
log, n = [], [0]
def send(m, p=None):
    n[0] += 1; ws.send(json.dumps({"id": n[0], "method": m, "params": p or {}})); return n[0]
def pump(sec):
    end = time.time() + sec
    while time.time() < end:
        try: m = json.loads(ws.recv())
        except Exception: continue
        if m.get("method") in ("Runtime.exceptionThrown", "Runtime.consoleAPICalled", "Log.entryAdded"): log.append(m)
        elif "id" in m and m.get("result", {}).get("result", {}).get("value") is not None: log.append({"eval": m["result"]["result"]["value"]})
for m in ("Runtime.enable", "Log.enable", "Page.enable"): send(m)
INJ = os.environ.get("INJECT", "")
if INJ and os.path.exists(INJ): send("Page.addScriptToEvaluateOnNewDocument", {"source": open(INJ, encoding="utf-8").read()}); print("inject", INJ)
pump(1); send("Page.reload", {"ignoreCache": True}); pump(8); shot("01-title")
EV = ("JSON.stringify({ua: navigator.userAgent, old284: window.__old284 || null, app: (function(){var r=document.getElementById('app').getBoundingClientRect();return [r.width,r.height]})(),"
      " u: getComputedStyle(document.getElementById('app')).getPropertyValue('--u')})")
send("Runtime.evaluate", {"expression": EV, "returnByValue": True}); pump(1)
send("Runtime.evaluate", {"expression": "document.getElementById('spPlay').click(), 'clicked'", "returnByValue": True}); pump(8); shot("02-level")
import base64
def cshot(name):
    i = send("Page.captureScreenshot", {"format": "png"}); end = time.time() + 10
    while time.time() < end:
        try: m = json.loads(ws.recv())
        except Exception: continue
        if m.get("id") == i: open(f"{OUT}/{name}.png", "wb").write(base64.b64decode(m["result"]["data"])); return
cshot("03-level-cdp")
send("Runtime.evaluate", {"expression": "JSON.stringify({boot: !!document.getElementById('boot'), vis: document.visibilityState, bootT: window.__bootT || null, scr: document.getElementById('app').className})", "returnByValue": True}); pump(1)
send("Runtime.evaluate", {"expression": "JSON.stringify([...document.querySelectorAll('#board,#tray,.vali,#game, #app > *')].slice(0,40).map(e=>[e.id||e.className, Math.round(e.getBoundingClientRect().width), Math.round(e.getBoundingClientRect().height), getComputedStyle(e).display]))", "returnByValue": True}); pump(2)
json.dump(log, open(f"{OUT}/console.json", "w"), ensure_ascii=False, indent=1)
for m in log:
    p = m.get("params", {})
    if "exceptionDetails" in p: d = p["exceptionDetails"]; print("EXC", d.get("text"), (d.get("exception") or {}).get("description", "")[:500], d.get("url"), d.get("lineNumber"), d.get("columnNumber"))
    elif "entry" in p: print("LOG", p["entry"].get("level"), p["entry"].get("text", "")[:300], p["entry"].get("url"), p["entry"].get("lineNumber"))
    elif "args" in p: print("CON", p.get("type"), [a.get("value", a.get("description")) for a in p["args"]][:4])
    else: print("EVAL", str(m.get("eval"))[:1500])
