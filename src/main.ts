import { defineCustomElement } from "vue"
import { kebabCase } from "lodash-es"
import PreviewImageVue from "Components/PreviewImage.ce.vue"
import NumberUnitVue from "Components/NumberUnit.ce.vue"

const PreviewImage = defineCustomElement(PreviewImageVue)
const NumberUnit = defineCustomElement(NumberUnitVue)

const Components: Record<string, ReturnType<typeof defineCustomElement>> = {
  PreviewImage,
  NumberUnit,
}

// 导出所有组件
export { PreviewImage, NumberUnit }

// 默认导出所有组件的集合
export default Components

// 全局注册函数
export function register(key?: string, component?: CustomElementConstructor) {
  if (key && component) {
    customElements.get(key) || customElements.define(key, component)
  } else {
    Object.keys(Components).forEach((key) => {
      customElements.get(kebabCase(key)) || customElements.define(kebabCase(key), Components[key])
    })
  }
}

// 按需注册函数
export function registerPreviewImage() {
  customElements.get('preview-image') || customElements.define('preview-image', PreviewImage)
}

export function registerNumberUnit() {
  customElements.get('number-unit') || customElements.define('number-unit', NumberUnit)
}
