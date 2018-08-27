/* eslint-disable no-undef */

import { shallowMount } from '@vue/test-utils'
import ConfirmModal from '@/adminviews/components/InputModal.vue'
import BackendCourseDetail from '@/adminviews/course/detail.vue'

const $route = {
  path: '/admin/course/detail',
  query: {'course_id': 0}
}

describe('课程详情模块单元测验', () => {
  const wrapper = shallowMount(BackendCourseDetail, {
    mocks: {
      $route
    }
  })

  it('标题是"课程详情"', () => {
    expect(wrapper.find('h1').text()).toEqual('课程详情')
  })

  it('删除课程模态框测试', () => {
    expect(wrapper.contains(ConfirmModal)).toBe(false)
    wrapper.findAll('[type=button]').at(1).trigger('click')
    expect(wrapper.contains('#delete')).toBe(true)
  })
})
