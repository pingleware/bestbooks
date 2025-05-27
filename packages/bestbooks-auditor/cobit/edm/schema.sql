-- Governance Framework table
CREATE TABLE IF NOT EXISTS GovernanceFramework (
    framework_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    version TEXT NOT NULL
);

-- Governance Objectives table
CREATE TABLE IF NOT EXISTS GovernanceObjectives (
    objective_id INTEGER PRIMARY KEY,
    framework_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    priority INTEGER NOT NULL,
    FOREIGN KEY (framework_id)
        REFERENCES GovernanceFramework (framework_id)
            ON DELETE CASCADE
);

-- Governance Processes table
CREATE TABLE IF NOT EXISTS GovernanceProcesses (
    process_id INTEGER PRIMARY KEY,
    objective_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    owner TEXT NOT NULL,
    FOREIGN KEY (objective_id)
        REFERENCES GovernanceObjectives (objective_id)
            ON DELETE CASCADE
);

-- Key Performance Indicators (KPIs) table
CREATE TABLE IF NOT EXISTS KPIs (
    kpi_id INTEGER PRIMARY KEY,
    process_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    target_value REAL NOT NULL,
    FOREIGN KEY (process_id)
        REFERENCES GovernanceProcesses (process_id)
            ON DELETE CASCADE
);

-- Control Objectives table
CREATE TABLE IF NOT EXISTS ControlObjectives (
    control_id INTEGER PRIMARY KEY,
    process_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    control_owner TEXT NOT NULL,
    FOREIGN KEY (process_id)
        REFERENCES GovernanceProcesses (process_id)
            ON DELETE CASCADE
);

-- Control Activities table
CREATE TABLE IF NOT EXISTS ControlActivities (
    activity_id INTEGER PRIMARY KEY,
    control_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    responsible_party TEXT NOT NULL,
    FOREIGN KEY (control_id)
        REFERENCES ControlObjectives (control_id)
            ON DELETE CASCADE
);

-- Control Tests table
CREATE TABLE IF NOT EXISTS ControlTests (
    test_id INTEGER PRIMARY KEY,
    activity_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    test_result TEXT NOT NULL,
    FOREIGN KEY (activity_id)
        REFERENCES ControlActivities (activity_id)
            ON DELETE CASCADE
);
