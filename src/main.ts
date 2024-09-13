import { defineCustomElement } from 'vue'
import {kebabCase} from 'lodash'
import PreviewImageVue from './components/PreviewImage.ce.vue'

const PreviewImage = defineCustomElement(PreviewImageVue)

const Components: Record<string, ReturnType<typeof defineCustomElement>> = {
    PreviewImage
}

export default Components

export function register (key: string, component: CustomElementConstructor) {
    if(key){
        customElements.define(key, component)
    }else{
        Object.keys(Components).forEach(key => {
            customElements.define(kebabCase(key), Components[key])
        })
    }
}