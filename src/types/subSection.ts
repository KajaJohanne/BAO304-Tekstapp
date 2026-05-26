export type subSectionState = {
    applicationId: string;
    applicationName: string;
    sectionName: string;
    subSectionName?: string;
    from?: {
        pathname: string;
    }
};

export type SubSectionItem = {
    name: string;
};