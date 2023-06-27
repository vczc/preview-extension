import { PostMessageType, State } from '../../types/interface'
import { CustomEventName, CdpPageEventName, CdpOverlayEventName, myInjectionKey, CdpDomEventName } from '../../constants/const'
import { onMounted, onUnmounted, reactive, ref, watch, defineEmits } from 'vue'
import { usePageStore } from '../../services/store.service'

interface CanvasReactive {
  canvasContext: CanvasRenderingContext2D | null
  frameId: number | null
  frame: object | null
  imageZoom: number | null
  screenOffsetTop: number | null
  scrollOffsetX: number
  scrollOffsetY: number
}

export function useCanvasRenderHook() {
  const emit = defineEmits<{
    (e: 'handleMouseMoved', params: any): void
    (e: 'handleInspectElement', params: any): void
    (e: 'handleScreencastInteraction', action: any, params: any): void
    (e: 'handleInspectHighlightRequested', params: any): void
  }>()
  const canvasRef: any = ref(null)
  const imageRef: any = ref(null)
  const store = usePageStore()
  const state = reactive<CanvasReactive>({
    canvasContext: null,
    frameId: null,
    frame: store.state.frame,
    imageZoom: 1,
    screenOffsetTop: 0,
    scrollOffsetX: 0,
    scrollOffsetY: 0
  })

  watch(state.frame || {}, (newVal, oldVal) => {
    console.log('🎨', [newVal, oldVal])
    // if (newVal !== oldVal) {
    console.log('🎨🎨')
    renderScreencastFrame()
    // }
  })

  onMounted(() => {
    startLoop()
  })

  onUnmounted(() => {
    stopLoop()
  })

  function startLoop() {
    if (!state.frameId) {
      state.frameId = window.requestAnimationFrame(renderLoop)
    }
  }

  function stopLoop() {
    if (state.frameId) {
      window.cancelAnimationFrame(state.frameId)
    }
  }

  function renderLoop() {
    renderFrame()
    state.frameId = window.requestAnimationFrame(renderLoop)
  }

  function renderFrame() {
    const canvasElement: any = canvasRef.value
    const imageElement = imageRef.value
    // console.log('🎨🎨画布元素', canvasElement)
    // console.log('🎨🎨图片元素ss', imageElement)
    if (!canvasElement || !imageElement) {
      return
    }

    // @ts-ignore
    state.canvasContext = canvasRef.value.getContext('2d')

    if (!state.canvasContext) {
      return
    }

    state.canvasContext.imageSmoothingEnabled = false

    const checkerboardPattern = getCheckerboardPattern(canvasElement, state.canvasContext)
    const devicePixelRatio = window.devicePixelRatio || 1
    const { screenZoom } = store.state.viewportMetadata
    const width = 1200
    const height = 800

    canvasElement.width = (width || 0) * devicePixelRatio
    canvasElement.height = (height || 0) * devicePixelRatio
    state.canvasContext.scale(devicePixelRatio, devicePixelRatio)

    state.canvasContext.save()
    state.canvasContext.fillStyle = checkerboardPattern
    state.canvasContext.fillRect(0, 0, width || 0, height || 0)
    state.canvasContext.restore()

    const dy = (state.screenOffsetTop || 0) * screenZoom
    const dw = width || 0
    const dh = height || 0

    // Render screen frame
    state.canvasContext.save()
    state.canvasContext.drawImage(imageElement, 0, dy, dw, dh)
    state.canvasContext.restore()

    // Render element highlight
    if (store.state.viewportMetadata && store.state.viewportMetadata.highlightInfo) {
      const model = scaleBoxModelToViewport(store.state.viewportMetadata.highlightInfo)
      const config = {
        contentColor: 'rgba(111, 168, 220, .66)',
        paddingColor: 'rgba(147, 196, 125, .55)',
        borderColor: 'rgba(255, 229, 153, .66)',
        marginColor: 'rgba(246, 178, 107, .66)'
      }

      state.canvasContext.save()

      const quads = []

      if (model.content) {
        quads.push({ quad: model.content, color: config.contentColor })
      }

      if (model.padding) {
        quads.push({ quad: model.padding, color: config.paddingColor })
      }

      if (model.border) {
        quads.push({ quad: model.border, color: config.borderColor })
      }

      if (model.margin) {
        quads.push({ quad: model.margin, color: config.marginColor })
      }

      for (let i = quads.length - 1; i > 0; --i) {
        state.canvasContext.save()
        state.canvasContext.globalAlpha = 0.66

        drawOutlinedQuadWithClip(state.canvasContext, quads[i].quad, quads[i - 1].quad, quads[i].color)
        state.canvasContext.restore()
      }

      if (quads.length > 0) {
        state.canvasContext.save()
        drawOutlinedQuad(state.canvasContext, quads[0].quad, quads[0].color)
        state.canvasContext.restore()
      }

      state.canvasContext.restore()
    }
  }

  function getCheckerboardPattern(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): CanvasPattern {
    const pattern = canvas
    const size = 32
    const pctx = pattern.getContext('2d')

    // Pattern size
    pattern.width = size * 2
    pattern.height = size * 2

    if (pctx) {
      // Dark grey
      pctx.fillStyle = 'rgb(195, 195, 195)'
      pctx.fillRect(0, 0, size * 2, size * 2)

      // Light grey
      pctx.fillStyle = 'rgb(225, 225, 225)'
      pctx.fillRect(0, 0, size, size)
      pctx.fillRect(size, size, size, size)
    }

    const result = context.createPattern(pattern, 'repeat')
    if (result) {
      return result
    } else {
      return new CanvasPattern()
    }
  }

  function renderScreencastFrame() {
    const screencastFrame = store.state.frame
    const imageElement = imageRef.value

    const metadata = screencastFrame?.metadata
    const format = store.state.format

    store.updateState({
      screenOffsetTop: metadata.offsetTop,
      scrollOffsetX: metadata.scrollOffsetX,
      scrollOffsetY: metadata.scrollOffsetY
    })

    const { offsetTop, scrollOffsetX, scrollOffsetY } = metadata

    state.screenOffsetTop = offsetTop
    state.scrollOffsetX = scrollOffsetX
    state.scrollOffsetY = scrollOffsetY

    // @ts-ignore
    imageElement.src = 'data:image/' + format + ';base64,' + screencastFrame?.base64Data
    console.log('imageElement~~~~~~~~~~~~', imageElement)
  }

  function handleMouseEvent(event: any) {
    if (store.state.isInspectEnabled) {
      if (event.type === 'click') {
        const position = convertIntoScreenSpace(event)
        emit('handleInspectElement', { position })
      } else if (event.type === 'mousemove') {
        const position = convertIntoScreenSpace(event)
        emit('handleInspectHighlightRequested', { position })
      }
    } else {
      dispatchMouseEvent(event.nativeEvent)
    }

    if (event.type === 'mousemove') {
      const position = convertIntoScreenSpace(event)
      emit('handleMouseMoved', { position })
    }

    if (event.type === 'mousedown') {
      if (canvasRef.value) {
        canvasRef.value.focus()
      }
    }
  }

  function dispatchMouseEvent(event: any) {
    let clickCount = 0
    const buttons = { 0: 'none', 1: 'left', 2: 'middle', 3: 'right' }
    const types = {
      mousedown: 'mousePressed',
      mouseup: 'mouseReleased',
      mousemove: 'mouseMoved',
      wheel: 'mouseWheel',
      dblclick: 'dblclick'
    }

    if (!(event.type in types)) {
      return
    }

    const x = Math.round(event.offsetX / store.state.viewportMetadata.screenZoom)
    const y = Math.round(event.offsetY / store.state.viewportMetadata.screenZoom)

    const type = (types as any)[event.type]

    if (type === 'mousePressed' || type === 'mouseReleased') {
      clickCount = 1
    }

    const params = {
      type: type,
      x: x,
      y: y,
      modifiers: modifiersForEvent(event),
      button: (buttons as any)[event.which],
      clickCount: clickCount,
      deltaX: 0,
      deltaY: 0
    }

    // 处理双击无效 模拟按下抬起并将点击次数设为2
    if (type === 'dblclick') {
      mockDoubleClick(params)
      return
    }

    if (type === 'mouseWheel') {
      params.deltaX = event.deltaX / store.state.viewportMetadata.screenZoom
      params.deltaY = event.deltaY / store.state.viewportMetadata.screenZoom
    }

    emit('handleScreencastInteraction', 'Input.dispatchMouseEvent', params)
  }

  function mockDoubleClick(params: any) {
    params.clickCount = 2
    params.type = 'mousePressed'
    emit('handleScreencastInteraction', 'Input.dispatchMouseEvent', params)

    params.type = 'mouseReleased'
    emit('handleScreencastInteraction', 'Input.dispatchMouseEvent', params)
  }

  function convertIntoScreenSpace(event: any) {
    let screenOffsetTop = 0
    if (canvasRef.value && canvasRef.value) {
      // @ts-ignore
      screenOffsetTop = canvasRef.value?.getBoundingClientRect().top
    }

    return {
      x: Math.round(event.clientX / store.state.viewportMetadata.screenZoom + state.scrollOffsetX),
      y: Math.round(event.clientY / store.state.viewportMetadata.screenZoom - screenOffsetTop + state.scrollOffsetY)
    }
  }

  // 绘制路径
  function quadToPath(context: any, quad: any) {
    context.beginPath()
    context.moveTo(quad[0], quad[1])
    context.lineTo(quad[2], quad[3])
    context.lineTo(quad[4], quad[5])
    context.lineTo(quad[6], quad[7])
    context.closePath()
    return context
  }

  // 绘制轮廓四边形
  function drawOutlinedQuad(context: any, quad: any, fillColor: any) {
    context.lineWidth = 2
    quadToPath(context, quad).clip()
    context.fillStyle = fillColor
    context.fill()
  }

  // 剪辑绘制轮廓四边形
  function drawOutlinedQuadWithClip(context: any, quad: any, clipQuad: any, fillColor: any) {
    context.fillStyle = fillColor
    context.lineWidth = 0
    quadToPath(context, quad).fill()
    context.globalCompositeOperation = 'destination-out'
    context.fillStyle = 'red'
    quadToPath(context, clipQuad).fill()
  }

  // 将盒子模型缩放到视口
  function scaleBoxModelToViewport(model: any) {
    const zoomFactor = store.state.viewportMetadata.screenZoom
    const offsetTop = state.screenOffsetTop

    function scaleQuad(quad: any) {
      for (let i = 0; i < quad.length; i += 2) {
        quad[i] = quad[i] * zoomFactor
        quad[i + 1] = (quad[i + 1] + offsetTop) * zoomFactor
      }
    }

    scaleQuad(model.content)
    scaleQuad(model.padding)
    scaleQuad(model.border)
    scaleQuad(model.margin)

    return model
  }

  function emitKeyEvent(event: any) {
    let type
    switch (event.type) {
      case 'keydown':
        type = 'keyDown'
        break
      case 'keyup':
        type = 'keyUp'
        break
      case 'keypress':
        type = 'char'
        break
      default:
        return
    }

    const text = event.type === 'keypress' ? String.fromCharCode(event.charCode) : undefined
    const params = {
      type: type,
      modifiers: modifiersForEvent(event),
      text: text,
      unmodifiedText: text ? text.toLowerCase() : undefined,
      keyIdentifier: event.keyIdentifier,
      code: event.code,
      key: event.key,
      windowsVirtualKeyCode: event.keyCode,
      nativeVirtualKeyCode: event.keyCode,
      autoRepeat: false,
      isKeypad: false,
      isSystemKey: false
    }

    emit('handleScreencastInteraction', 'Input.dispatchKeyEvent', params)
  }

  // 处理键盘事件
  function handleKeyEvent(event: any) {
    emitKeyEvent(event.nativeEvent)

    if (event.key === 'Tab') {
      event.preventDefault()
    }

    if (canvasRef.value) {
      canvasRef.value.focus()
    }
  }

  function modifiersForEvent(event: any) {
    return (event.altKey ? 1 : 0) | (event.ctrlKey ? 2 : 0) | (event.metaKey ? 4 : 0) | (event.shiftKey ? 8 : 0)
  }

  return { imageRef, canvasRef, handleKeyEvent, handleMouseEvent }
}
