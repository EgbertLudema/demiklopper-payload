import * as migration_20250806_193020 from './20250806_193020';

export const migrations = [
  {
    up: migration_20250806_193020.up,
    down: migration_20250806_193020.down,
    name: '20250806_193020'
  },
];
