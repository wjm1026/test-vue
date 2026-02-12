import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import { defineComponent, h } from 'vue'

import GlobalErrorDialog from '@/components/dialog/GlobalErrorDialog.vue'

const mocks = vi.hoisted(() => {
