function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function Container(fontSize, fontFamily, color, lineHeight) {
  return `
      <div class="container">
        <div class="flex-box">
          <div class="flex-item">
            Font Size:
          </div>
          <div class="flex-item flex-value">
          ${fontSize}
          </div>
        </div>
        <div class="flex-box">
          <div class="flex-item">
            Font Family:
          </div>
          <div class="flex-item flex-value">
          ${fontFamily}
          </div>
        </div>
        <div class="flex-box">
          <div class="flex-item">
            Color: 
          </div>
          <div class="flex-item flex-color" style="background:${color};" >
          </div>
          <div class="flex-item flex-value">
          ${color}
          </div>
        </div>
        <div class="flex-box">
          <div class="flex-item">
           Line Height
          </div>
          <div class="flex-item flex-value">
          ${lineHeight}
          </div>
        </div>
      </div>
    `;
}

export function DebugPanel() {
  const panel = document.createElement("div");
  panel.className = "panel";
  const style = document.createElement("style");
  let attached = false;
  const fontSelectorMap = new Map();
  let currTarget = null;

  style.innerHTML = `
      .panel{
        position:absolute;
        transform:translate(-50%,20%);
        border:2px solid black;
        font-family: sans-serif;
        padding: 8px;
        background: #111;
        color: white;
        border-radius: 4px;
        opacity:0.9;
      }
      .container {
        display: flex;
        flex-flow: column;
        width: 100%;
      }
      .flex-box {
        display: flex;
        flex-flow: row;
        justify-content: flex-start;
        align-items:center;
        border: 1px solid rgba(255,255,255,0.2);
        margin: 2px;
        border-radius: 2px;
      }
      .flex-item{
        width: 100px;
        max-height: 64px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        padding: 8px;
      }
      .flex-value {
        width: 200px
      }
      .flex-color {
        width: 8px;
        height: 8px;
        border-radius: 4px;
        margin-left: 12px; 
      }
      .inspect-highlight {
        background: rgba(0,0,240,0.1);
        transition: background .2s ease-in, outline .3s ease-in;
      }
    `;
  function attachPanel() {
    document.body.appendChild(panel);
    document.body.appendChild(style);
    document.body.addEventListener("mousemove", movePanel);
    attached = true;
  }

  function detachPanel() {
    if (!attached) return false;
    document.body.removeChild(panel);
    document.body.removeChild(style);
    document.body.removeEventListener("mousemove", movePanel);
    attached = false;
  }

  function movePanel(e) {
    panel.style.left = e.pageX + "px";
    panel.style.top = e.pageY + "px";
    _getFontData(e.target);
    if (currTarget !== e.target) {
      currTarget?.classList?.remove("inspect-highlight");
      currTarget = e.target;
      e.target.classList.add("inspect-highlight");
    }
  }

  function updatePanel(data) {
    panel.innerHTML = Container(
      data.fontSize,
      data.fontFamily,
      data.color,
      data.lineHeight
    );
  }

  function _getFontData(target) {
    const targetSelector = target.classList;
    let existingStyle = null;
    targetSelector.forEach((sel) => {
      existingStyle = fontSelectorMap.get(sel);
    });
    if (existingStyle) {
      updatePanel(existingStyle);
      return;
    }
    const compStyles = window.getComputedStyle(target);
    const fontSize = compStyles.getPropertyValue("font-size");
    const fontFamily = compStyles.getPropertyValue("font-family");
    const lineHeight = compStyles.getPropertyValue("line-height");
    const color = compStyles.getPropertyValue("color");
    const id = makeid(5);
    target.classList.add(id);
    fontSelectorMap.set(id, {
      fontFamily,
      lineHeight,
      fontSize,
      target,
      color,
    });
    updatePanel({
      fontFamily,
      lineHeight,
      fontSize,
      target,
      color,
    });
  }
  return {
    attachPanel,
    detachPanel,
  };
}
