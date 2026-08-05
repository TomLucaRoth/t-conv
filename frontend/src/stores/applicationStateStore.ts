import {create} from 'zustand'
import type {Report} from '../types/report'

type ApplicationState = {
    progress: number
    running: boolean
    report: Report | null
    setProgress: (progress: number) => void
    setRunning: (running: boolean) => void
    setReport: (report: Report | null) => void
}

export const useApplicationStateStore = create<ApplicationState>((set) => ({
    progress: 0,
    running: false,
    report: null,
    setProgress: (progress) => set({progress}),
    setRunning: (running) => set({running}),
    setReport: (report) => set({report}),
}))
