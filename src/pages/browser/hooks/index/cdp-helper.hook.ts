import { PostMessageType, State } from '../../types/interface'
import { CustomEventName, CdpPageEventName, CdpOverlayEventName, myInjectionKey, CdpDomEventName } from '../../constants/const'

interface PropParams {
  postMessage: PostMessageType
}

export function useCdpHelperHook(props: PropParams) {
  const { postMessage } = props

  async function getProperties(objectId: string) {
    const data: any = await postMessage.send('Runtime.getProperties', {
      objectId: objectId,
      ownProperties: true
    })

    return data.result as Array<object>
  }

  async function getCursorForNode(nodeInfo: any) {
    let nodeId = nodeInfo.nodeId
    if (!nodeInfo.nodeId) {
      nodeId = getNodeIdFromBackendId(nodeInfo.backendNodeId)
    }

    if (!nodeId) {
      return
    }

    const computedStyleReq: any = await postMessage.send('CSS.getComputedStyleForNode', {
      nodeId: nodeId
    })

    const cursorCSS = (computedStyleReq?.computedStyle || []).find((c: any) => c.name === 'cursor')

    return cursorCSS.value
  }

  async function getNodeIdFromBackendId(backendNodeId: any) {
    await postMessage.send('DOM.getDocument')
    const nodeIdsReq: any = await postMessage.send('DOM.pushNodesByBackendIdsToFrontend', {
      backendNodeIds: [backendNodeId]
    })

    if (nodeIdsReq) {
      return nodeIdsReq?.nodeIds[0]
    }
  }

  async function resolveElementProperties(objectId: any, maxDepth: number) {
    const initialProperties = await getProperties(objectId)

    const resolve = async (props: any, passedDepth: number) => {
      const resolveResult = {}
      const internalCurentDepth = passedDepth | 0

      for (const item of props) {
        let value = null
        if (item.value) {
          if (item.value.type === 'object') {
            if (item.value.objectId) {
              if (internalCurentDepth < maxDepth) {
                value = await getProperties(item.value.objectId)
                if (Array.isArray(value)) {
                  const newDepth = internalCurentDepth + 1
                  value = await resolve(value, newDepth)
                }
              } else {
                value = '<max depth reached>'
              }
            } else if (item.value.value) {
              value = item.value.value
            }
          } else if (item.value.type === 'function') {
            value = 'function'
          } else if (item.value.type === 'string') {
            value = item.value.value
          } else if (item.value.type === 'number') {
            value = item.value.value
          }
        }

        Object.defineProperty(resolveResult, item.name, {
          value: value,
          enumerable: item.enumerable,
          configurable: item.configurable,
          writable: item.writable
        })
      }
      return resolveResult
    }

    const result = await resolve(initialProperties, 0)

    return result
  }

  return {
    getCursorForNode,
    getNodeIdFromBackendId,
    resolveElementProperties
  }
}
