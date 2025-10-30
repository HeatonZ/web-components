import { describe, it, expect, vi, beforeEach } from "vitest"
import { mount } from "@vue/test-utils"
import PreviewImage from "../PreviewImage.ce.vue"

// Mock fetch API
global.fetch = vi.fn()

describe("PreviewImage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("应该在图片可用时渲染 img 标签", async () => {
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
    })

    const wrapper = mount(PreviewImage, {
      props: {
        src: "https://example.com/image.jpg",
      },
      attrs: {
        alt: "测试图片",
      },
    })

    // 等待异步操作完成
    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))

    const img = wrapper.find("img")
    expect(img.exists()).toBe(true)
    expect(img.attributes("src")).toBe("https://example.com/image.jpg")
    expect(img.attributes("alt")).toBe("测试图片")
  })

  it("应该在图片不可用时不渲染 img 标签", async () => {
    ;(global.fetch as any).mockResolvedValue({
      ok: false,
    })

    const wrapper = mount(PreviewImage, {
      props: {
        src: "https://example.com/missing.jpg",
      },
    })

    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))

    const img = wrapper.find("img")
    expect(img.exists()).toBe(false)
  })

  it("应该在 fetch 失败时不渲染 img 标签", async () => {
    ;(global.fetch as any).mockRejectedValue(new Error("Network error"))

    const wrapper = mount(PreviewImage, {
      props: {
        src: "https://example.com/error.jpg",
      },
    })

    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))

    const img = wrapper.find("img")
    expect(img.exists()).toBe(false)
  })

  it("应该在没有 src 时不进行 fetch", async () => {
    const wrapper = mount(PreviewImage, {
      props: {
        src: "",
      },
    })

    await wrapper.vm.$nextTick()

    expect(global.fetch).not.toHaveBeenCalled()
  })

  it("应该支持自定义 requestInit", async () => {
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
    })

    const customInit = {
      headers: {
        Authorization: "Bearer token",
      },
    }

    mount(PreviewImage, {
      props: {
        src: "https://example.com/image.jpg",
        requestInit: customInit,
      },
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(global.fetch).toHaveBeenCalledWith(
      "https://example.com/image.jpg",
      expect.objectContaining({
        method: "HEAD",
        headers: {
          Authorization: "Bearer token",
        },
      })
    )
  })
})

