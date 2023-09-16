export class MockData<K, T> {
    private data = new Map<K, T>();

    constructor(private ctor: () => T) {}

    get(key: K) {
        if (!this.data.has(key)) {
            this.set(key, this.ctor());
        }
        return this.data.get(key);
    }

    set(robot: K, data: T) {
        this.data.set(robot, data);
    }
}
