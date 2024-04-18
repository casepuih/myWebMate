export class Meet {
    id: number
    title: string
    description: string
    dateBegin: Date
    dateEnding: Date
    isRecurring: boolean
    recurrence: string
    source: 'local' | 'google';
    MemberId?: number[]
}