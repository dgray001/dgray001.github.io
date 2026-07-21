// Single source of truth shared with the backend (config/permissions.json)
import permissions_json from '../../config/permissions.json';

export const permissions: Record<string, string[]> = permissions_json;
