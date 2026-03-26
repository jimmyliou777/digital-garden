import { QuartzFilterPlugin } from "../types"

export const RemoveExcalidraw: QuartzFilterPlugin<{}> = () => ({
  name: "RemoveExcalidraw",
  shouldPublish(_ctx, [_tree, vfile]) {
    const slug = vfile.data?.slug ?? ""
    return !slug.endsWith(".excalidraw")
  },
})
