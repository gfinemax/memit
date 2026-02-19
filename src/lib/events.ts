// Global event emitter for cross-component communication
type Callback = (data?: any) => void;

class EventEmitter {
    private events: { [key: string]: Callback[] } = {};

    on(event: string, callback: Callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    off(event: string, callback: Callback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    }

    emit(event: string, data?: any) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => callback(data));
    }
}

export const eventBus = new EventEmitter();

export const APP_EVENTS = {
    FOCUS_INPUT: 'FOCUS_INPUT',
    OPEN_QUICK_MENU: 'OPEN_QUICK_MENU',
    SET_NAV_VISIBILITY: 'SET_NAV_VISIBILITY'
};
