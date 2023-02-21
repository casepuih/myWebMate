export interface LinksGroup {
  id: number;
  name: string;
  description: string;
}

export interface LinksGroupArray {
  linksGroup: LinksGroup[];
}

export interface LinksGroups {
  results: LinksGroupArray;
  status: number;
}
