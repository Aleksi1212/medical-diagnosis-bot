function removeKeysFromObjects(obj: Record<string, any>, keyToKeep: string) {
    return { [keyToKeep]: obj[keyToKeep] };
}

export default removeKeysFromObjects;
