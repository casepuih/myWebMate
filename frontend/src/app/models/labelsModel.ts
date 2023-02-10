export interface Label {
    id: number;
    title: string;
    color: string;
}

export interface LabelsArray {
    labels: Label[];
}

export interface Labels {
    result: LabelsArray;
    status: number;
}
