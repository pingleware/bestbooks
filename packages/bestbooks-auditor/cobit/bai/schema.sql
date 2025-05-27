-- Governance Framework table
CREATE TABLE IF NOT EXISTS GovernanceFramework (
    framework_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    version TEXT NOT NULL
);

-- Strategic Goals table
CREATE TABLE IF NOT EXISTS StrategicGoals (
    goal_id INTEGER PRIMARY KEY,
    framework_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY (framework_id)
        REFERENCES GovernanceFramework (framework_id)
            ON DELETE CASCADE
);

-- Business Processes table
CREATE TABLE IF NOT EXISTS BusinessProcesses (
    process_id INTEGER PRIMARY KEY,
    goal_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    owner TEXT NOT NULL,
    FOREIGN KEY (goal_id)
        REFERENCES StrategicGoals (goal_id)
            ON DELETE CASCADE
);

-- Policies table
CREATE TABLE IF NOT EXISTS Policies (
    policy_id INTEGER PRIMARY KEY,
    process_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY (process_id)
        REFERENCES BusinessProcesses (process_id)
            ON DELETE CASCADE
);

-- Procedures table
CREATE TABLE IF NOT EXISTS Procedures (
    procedure_id INTEGER PRIMARY KEY,
    policy_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    responsible_party TEXT NOT NULL,
    FOREIGN KEY (policy_id)
        REFERENCES Policies (policy_id)
            ON DELETE CASCADE
);

-- Metrics table
CREATE TABLE IF NOT EXISTS Metrics (
    metric_id INTEGER PRIMARY KEY,
    process_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    target_value REAL NOT NULL,
    FOREIGN KEY (process_id)
        REFERENCES BusinessProcesses (process_id)
            ON DELETE CASCADE
);

-- Controls table
CREATE TABLE IF NOT EXISTS Controls (
    control_id INTEGER PRIMARY KEY,
    policy_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    control_owner TEXT NOT NULL,
    FOREIGN KEY (policy_id)
        REFERENCES Policies (policy_id)
            ON DELETE CASCADE
);

-- Control Tests table
CREATE TABLE IF NOT EXISTS ControlTests (
    test_id INTEGER PRIMARY KEY,
    control_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    test_result TEXT NOT NULL,
    FOREIGN KEY (control_id)
        REFERENCES Controls (control_id)
            ON DELETE CASCADE
);
