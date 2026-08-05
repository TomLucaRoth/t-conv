import {useEffect} from 'react'
import {EventsOn} from '../wailsjs/runtime/runtime'
import {useApplicationStateStore} from './stores/applicationStateStore'
import type {Report} from './types/report'
import Header from './components/Header'
import Converter from './components/Converter'

function App() {
    const setProgress = useApplicationStateStore((state) => state.setProgress)
    const setReport = useApplicationStateStore((state) => state.setReport)

    useEffect(() => {
        const unsubscribeProgress = EventsOn('progress', (progress: number) => {
            setProgress(progress)
        })
        const unsubscribeReport = EventsOn('report', (report: string) => {
            setReport(JSON.parse(report) as Report)
        })

        return () => {
            unsubscribeProgress()
            unsubscribeReport()
        }
    }, [setProgress, setReport])

    return (
        <div className='flex flex-col'>
            <Header />
            <Converter />
        </div>
    )
}

export default App
