const DEFAULT_LOCATION = 'Kyiv';

export class LocationService {
    private location: string = DEFAULT_LOCATION;

    setLocation(location: string) {
        this.location = location;
    }

    getLocation(): string {
        return this.location;
    }
}
