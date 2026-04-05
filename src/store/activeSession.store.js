let activeSession = null;

const ActiveSessionStore = {
    startSession: (classId) => {
        if (activeSession) {
            throw new Error("An active session is already running");
        }
        activeSession = {
            classId,
            startedAt: new Date().toISOString(),
            attendance: {},
        };

        return activeSession;
    },

    getSession: () => {
        return activeSession;
    },

    endSession: () => {
        activeSession = null;
    }
};

module.exports = ActiveSessionStore;