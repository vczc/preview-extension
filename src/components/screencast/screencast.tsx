import * as React from 'react';
import './screencast.css';
import ScrollBar from '../scroll-bar/scroll-bar';

// This implementation is heavily inspired by https://cs.chromium.org/chromium/src/third_party/blink/renderer/devtools/front_end/screencast/ScreencastView.js

class Screencast extends React.Component<any, any> {
  private canvasRef: React.RefObject<HTMLCanvasElement>;
  private imageRef: React.RefObject<HTMLImageElement>;
  private canvasContext: CanvasRenderingContext2D | null;
  private frameId: number | null;
  private frame: string | null;
  private viewportMetadata: any;

  constructor(props: any) {
    super(props);
    this.canvasRef = React.createRef();
    this.imageRef = React.createRef();
    this.canvasContext = null;
    this.frameId = null;
    this.frame = props.frame;

    this.handleMouseEvent = this.handleMouseEvent.bind(this);
    this.handleKeyEvent = this.handleKeyEvent.bind(this);
    this.renderLoop = this.renderLoop.bind(this);

    this.state = {
      imageZoom: 1,
      screenOffsetTop: 0,
    };
  }

  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    if (nextProps.frame !== prevState.frame) {
      return {
        frame: nextProps.frame,
      };
    } else return null;
  }

  public componentDidUpdate(prevProps: any, prevState: any) {
    if (prevState.frame !== this.state.frame) {
      this.renderScreencastFrame();
    }
  }

  public componentDidMount() {
    this.startLoop();
  }

  public componentWillUnmount() {
    this.stopLoop();
  }

  public startLoop() {
    if (!this.frameId) {
      this.frameId = window.requestAnimationFrame(this.renderLoop);
    }
  }

  public stopLoop() {
    if (this.frameId) {
      window.cancelAnimationFrame(this.frameId);
    }
  }

  // 渲染循环
  public renderLoop() {
    this.renderFrame();
    this.frameId = window.requestAnimationFrame(this.renderLoop); // Set up next iteration of the loop
  }

  public render() {
    const { width, height, viewport, scrollWidth, scrollHeight } = this.props;
    const canvasStyle = { cursor: this.viewportMetadata ? this.viewportMetadata.cursor : 'auto' };

    return (
      <>
        <div style={{ height: `100%;`, width: `100%`, display: 'flex' }}>
          <img ref={this.imageRef} className="img-hidden" />
          <canvas
            className="screencast"
            style={canvasStyle}
            ref={this.canvasRef}
            onMouseDown={this.handleMouseEvent}
            onMouseUp={this.handleMouseEvent}
            onMouseMove={this.handleMouseEvent}
            onClick={this.handleMouseEvent}
            onDoubleClick={this.handleMouseEvent}
            onWheel={this.handleMouseEvent}
            onKeyDown={this.handleKeyEvent}
            onKeyUp={this.handleKeyEvent}
            onKeyPress={this.handleKeyEvent}
            tabIndex={0}
          />
          {this.props.scrollHeight > this.props.viewport.height && (
            <ScrollBar
              axis="y"
              width={width}
              height={height}
              viewport={viewport}
              scrollWidth={scrollWidth}
              scrollHeight={scrollHeight}
              dispatchMouseEvent={this.dispatchMouseEvent}
              handleMouseEvent={this.handleMouseEvent}
            />
          )}
        </div>

        {this.props.scrollWidth > this.props.viewport.width && (
          <ScrollBar
            axis="x"
            width={width}
            height={height}
            viewport={viewport}
            scrollWidth={scrollWidth}
            scrollHeight={scrollHeight}
            dispatchMouseEvent={this.dispatchMouseEvent}
            handleMouseEvent={this.handleMouseEvent}
          />
        )}
      </>
    );
  }

  // 渲染canvas
  private renderFrame() {
    if (!this.canvasRef.current || !this.imageRef.current) {
      return;
    }

    this.viewportMetadata = this.props.viewportMetadata;
    this.canvasContext = this.canvasRef.current.getContext('2d');
    const canvasElement = this.canvasRef.current;
    const imageElement = this.imageRef.current;

    if (!this.canvasContext) {
      return;
    }

    this.canvasContext.imageSmoothingEnabled = false;

    const checkerboardPattern = this.getCheckerboardPattern(canvasElement, this.canvasContext);
    const devicePixelRatio = window.devicePixelRatio || 1;

    // Resize and scale canvas
    const canvasWidth = this.props.width;
    const canvasHeight = this.props.height;

    // TODO Move out to increase performance
    canvasElement.width = canvasWidth * devicePixelRatio;
    canvasElement.height = canvasHeight * devicePixelRatio;
    this.canvasContext.scale(devicePixelRatio, devicePixelRatio);

    // Render checkerboard
    this.canvasContext.save();
    this.canvasContext.fillStyle = checkerboardPattern;
    this.canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
    this.canvasContext.restore();

    // Render viewport frame
    const dy = this.state.screenOffsetTop * this.viewportMetadata.screenZoom;
    const dw = this.props.width;
    const dh = this.props.height;

    // Render screen frame
    this.canvasContext.save();
    this.canvasContext.drawImage(imageElement, 0, dy, dw, dh);
    this.canvasContext.restore();

    // Render element highlight
    if (this.props.viewportMetadata && this.props.viewportMetadata.highlightInfo) {
      const model = this.scaleBoxModelToViewport(this.props.viewportMetadata.highlightInfo);
      const config = {
        contentColor: 'rgba(111, 168, 220, .66)',
        paddingColor: 'rgba(147, 196, 125, .55)',
        borderColor: 'rgba(255, 229, 153, .66)',
        marginColor: 'rgba(246, 178, 107, .66)',
      };

      this.canvasContext.save();

      const quads = [];

      if (model.content) {
        quads.push({ quad: model.content, color: config.contentColor });
      }

      if (model.padding) {
        quads.push({ quad: model.padding, color: config.paddingColor });
      }

      if (model.border) {
        quads.push({ quad: model.border, color: config.borderColor });
      }

      if (model.margin) {
        quads.push({ quad: model.margin, color: config.marginColor });
      }

      for (let i = quads.length - 1; i > 0; --i) {
        this.canvasContext.save();
        this.canvasContext.globalAlpha = 0.66;

        this.drawOutlinedQuadWithClip(this.canvasContext, quads[i].quad, quads[i - 1].quad, quads[i].color);
        this.canvasContext.restore();
      }

      if (quads.length > 0) {
        this.canvasContext.save();
        this.drawOutlinedQuad(this.canvasContext, quads[0].quad, quads[0].color);
        this.canvasContext.restore();
      }

      this.canvasContext.restore();
    }
  }

  // 渲染截屏帧
  public renderScreencastFrame() {
    const screencastFrame = this.props.frame;
    const imageElement = this.imageRef.current;

    if (imageElement && screencastFrame) {
      // const canvasWidth = this.props.width;
      // const canvasHeight = this.props.height;
      // const deviceSizeRatio = metadata.deviceHeight / metadata.deviceWidth;

      // let imageZoom = Math.min(
      //   canvasWidth / metadata.deviceWidth,
      //   canvasHeight / (metadata.deviceWidth * deviceSizeRatio)
      // );

      // if (imageZoom < 1.01 / window.devicePixelRatio) {
      //   imageZoom = 1 / window.devicePixelRatio;
      // }

      const metadata = screencastFrame.metadata;
      const format = this.props.format;

      this.setState({
        screenOffsetTop: metadata.offsetTop,
        scrollOffsetX: metadata.scrollOffsetX,
        scrollOffsetY: metadata.scrollOffsetY,
      });

      imageElement.src = 'data:image/' + format + ';base64,' + screencastFrame.base64Data;
    }
  }

  // 获取棋盘图案
  private getCheckerboardPattern(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): CanvasPattern {
    const pattern = canvas;
    const size = 32;
    const pctx = pattern.getContext('2d');

    // Pattern size
    pattern.width = size * 2;
    pattern.height = size * 2;

    if (pctx) {
      // Dark grey
      pctx.fillStyle = 'rgb(195, 195, 195)';
      pctx.fillRect(0, 0, size * 2, size * 2);

      // Light grey
      pctx.fillStyle = 'rgb(225, 225, 225)';
      pctx.fillRect(0, 0, size, size);
      pctx.fillRect(size, size, size, size);
    }

    const result = context.createPattern(pattern, 'repeat');
    if (result) {
      return result;
    } else {
      return new CanvasPattern();
    }
  }

  // 处理鼠标事件
  private handleMouseEvent(event: any) {
    if (this.props.isInspectEnabled) {
      if (event.type === 'click') {
        const position = this.convertIntoScreenSpace(event);
        this.props.onInspectElement({
          position: position,
        });
      } else if (event.type === 'mousemove') {
        const position = this.convertIntoScreenSpace(event);
        this.props.onInspectHighlightRequested({
          position: position,
        });
      }
    } else {
      this.dispatchMouseEvent(event.nativeEvent);
    }

    if (event.type === 'mousemove') {
      const position = this.convertIntoScreenSpace(event);
      this.props.onMouseMoved({
        position: position,
      });
    }

    if (event.type === 'mousedown') {
      if (this.canvasRef.current) {
        this.canvasRef.current.focus();
      }
    }
  }

  // 转为屏幕空间
  private convertIntoScreenSpace(event: any) {
    let screenOffsetTop = 0;
    if (this.canvasRef && this.canvasRef.current) {
      screenOffsetTop = this.canvasRef.current.getBoundingClientRect().top;
    }

    return {
      x: Math.round(event.clientX / this.viewportMetadata.screenZoom + this.state.scrollOffsetX),
      y: Math.round(event.clientY / this.viewportMetadata.screenZoom - screenOffsetTop + this.state.scrollOffsetY),
    };
  }

  // 绘制路径
  private quadToPath(context: any, quad: any) {
    context.beginPath();
    context.moveTo(quad[0], quad[1]);
    context.lineTo(quad[2], quad[3]);
    context.lineTo(quad[4], quad[5]);
    context.lineTo(quad[6], quad[7]);
    context.closePath();
    return context;
  }

  // 绘制轮廓四边形
  private drawOutlinedQuad(context: any, quad: any, fillColor: any) {
    context.lineWidth = 2;
    this.quadToPath(context, quad).clip();
    context.fillStyle = fillColor;
    context.fill();
  }

  // 剪辑绘制轮廓四边形
  private drawOutlinedQuadWithClip(context: any, quad: any, clipQuad: any, fillColor: any) {
    context.fillStyle = fillColor;
    context.lineWidth = 0;
    this.quadToPath(context, quad).fill();
    context.globalCompositeOperation = 'destination-out';
    context.fillStyle = 'red';
    this.quadToPath(context, clipQuad).fill();
  }

  // 将盒子模型缩放到视口
  private scaleBoxModelToViewport(model: any) {
    const zoomFactor = this.viewportMetadata.screenZoom;
    const offsetTop = this.state.screenOffsetTop;

    function scaleQuad(quad: any) {
      for (let i = 0; i < quad.length; i += 2) {
        quad[i] = quad[i] * zoomFactor;
        quad[i + 1] = (quad[i + 1] + offsetTop) * zoomFactor;
      }
    }

    scaleQuad.call(this, model.content);
    scaleQuad.call(this, model.padding);
    scaleQuad.call(this, model.border);
    scaleQuad.call(this, model.margin);

    return model;
  }

  // 处理键盘事件
  private handleKeyEvent(event: any) {
    this.emitKeyEvent(event.nativeEvent);

    if (event.key === 'Tab') {
      event.preventDefault();
    }

    if (this.canvasRef.current) {
      this.canvasRef.current.focus();
    }
  }

  private modifiersForEvent(event: any) {
    return (event.altKey ? 1 : 0) | (event.ctrlKey ? 2 : 0) | (event.metaKey ? 4 : 0) | (event.shiftKey ? 8 : 0);
  }

  // 派发键盘事件
  private emitKeyEvent(event: any) {
    let type;
    switch (event.type) {
      case 'keydown':
        type = 'keyDown';
        break;
      case 'keyup':
        type = 'keyUp';
        break;
      case 'keypress':
        type = 'char';
        break;
      default:
        return;
    }

    const text = event.type === 'keypress' ? String.fromCharCode(event.charCode) : undefined;
    const params = {
      type: type,
      modifiers: this.modifiersForEvent(event),
      text: text,
      unmodifiedText: text ? text.toLowerCase() : undefined,
      keyIdentifier: event.keyIdentifier,
      code: event.code,
      key: event.key,
      windowsVirtualKeyCode: event.keyCode,
      nativeVirtualKeyCode: event.keyCode,
      autoRepeat: false,
      isKeypad: false,
      isSystemKey: false,
    };

    this.props.onInteraction('Input.dispatchKeyEvent', params);
  }

  // 想chromium派发鼠标事件
  public dispatchMouseEvent = (event: any) => {
    let clickCount = 0;
    const buttons = { 0: 'none', 1: 'left', 2: 'middle', 3: 'right' };
    const types = {
      mousedown: 'mousePressed',
      mouseup: 'mouseReleased',
      mousemove: 'mouseMoved',
      wheel: 'mouseWheel',
      dblclick: 'dblclick',
    };

    if (!(event.type in types)) {
      return;
    }

    const x = Math.round(event.offsetX / this.viewportMetadata.screenZoom);
    const y = Math.round(event.offsetY / this.viewportMetadata.screenZoom);

    const type = (types as any)[event.type];

    if (type == 'mousePressed' || type == 'mouseReleased') {
      clickCount = 1;
    }

    const params = {
      type: type,
      x: x,
      y: y,
      modifiers: this.modifiersForEvent(event),
      button: (buttons as any)[event.which],
      clickCount: clickCount,
      deltaX: 0,
      deltaY: 0,
    };

    // 处理双击无效 模拟按下抬起并将点击次数设为2
    if (type === 'dblclick') {
      this.mockDoubleClick(params);
      return;
    }

    if (type === 'mouseWheel') {
      params.deltaX = event.deltaX / this.viewportMetadata.screenZoom;
      params.deltaY = event.deltaY / this.viewportMetadata.screenZoom;
    }

    this.props.onInteraction('Input.dispatchMouseEvent', params);
  };

  // 模拟双击操作
  mockDoubleClick = (params: any) => {
    params.clickCount = 2;
    params.type = 'mousePressed';
    this.props.onInteraction('Input.dispatchMouseEvent', params);

    params.type = 'mouseReleased';
    this.props.onInteraction('Input.dispatchMouseEvent', params);
  };
}

export default Screencast;
