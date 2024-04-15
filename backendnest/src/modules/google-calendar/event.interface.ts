export interface Event {
    id?: string
    summary?: string
    description?: string
    start?: {
        date?: string
        dateTime?: string
        timeZone?: string
    }
    end?: {
        date?: string,
        dateTime?: string
        timeZone?: string
    }
}