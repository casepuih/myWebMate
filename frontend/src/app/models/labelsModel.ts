export interface Label {
    id: number;
    title: string;
    color: string;
    projectId: number;
}

export interface LabelsArray {
    labels: Label[];
}

export interface Labels {
    result: LabelsArray;
    status: number;
}
