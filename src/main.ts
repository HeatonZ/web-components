import { defineCustomElement } from "vue"
import { kebabCase } from "lodash"
import PreviewImageVue from "Components/PreviewImage.ce.vue"
import NumberUnitVue from "Components/NumberUnit.vue"

const PreviewImage = defineCustomElement(PreviewImageVue)
const NumberUnit = defineCustomElement(NumberUnitVue)

const Components: Record<string, ReturnType<typeof defineCustomElement>> = {
  PreviewImage,
  NumberUnit,
}

export default Components

export function register(key?: string, component?: CustomElementConstructor) {
  if (key && component) {
    customElements.get(key) || customElements.define(key, component)
  } else {
    Object.keys(Components).forEach((key) => {
      customElements.get(kebabCase(key)) || customElements.define(kebabCase(key), Components[key])
    })
  }
}
