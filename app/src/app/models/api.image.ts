export interface IImage {
    id: number;
    name: string;
    url: string;
    relative: string;
}

export function imageFormData(id: null|number, name: string, file?: File) {
    const formData = new FormData();

    formData.append("name", name);

    if(id) {
        formData.append("id", id.toString());
    }

    if(file) {
        formData.append("file", file);
    }
    
    return formData;
}