import { describe, it, expect } from "vitest"
import { mount } from "@vue/test-utils"
import NumberUnit from "../NumberUnit.ce.vue"

describe("NumberUnit", () => {
  it("应该正确渲染数字和单位", () => {
    const wrapper = mount(NumberUnit, {
      props: {
        value: "1000",
        unit: "元",
      },
    })

    expect(wrapper.text()).toContain("元")
  })

  it("应该正确格式化大数字", () => {
    const wrapper = mount(NumberUnit, {
      props: {
        value: "1000000",
        unit: "元",
      },
    })

    const text = wrapper.text()
    expect(text).toBeTruthy()
    expect(text).toContain("元")
  })

  it("应该处理小数", () => {
    const wrapper = mount(NumberUnit, {
      props: {
        value: "1234.56",
        unit: "kg",
      },
    })

    const text = wrapper.text()
    expect(text).toBeTruthy()
    expect(text).toContain("kg")
  })

  it("应该处理空值", () => {
    const wrapper = mount(NumberUnit, {
      props: {
        value: "",
        unit: "元",
      },
    })

    expect(wrapper.text()).toContain("元")
  })
})

