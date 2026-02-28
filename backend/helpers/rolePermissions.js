const RolePermission = require('../models/RolePermission');
const Permission = require('../models/Permission');

/**
 * Get permission names for a role from role_has_permissions (Spatie)
 * @param {ObjectId} roleId
 * @returns {Promise<string[]>} permission names
 */
async function getPermissionNamesForRole(roleId) {
  const rps = await RolePermission.find({ roleId }).populate('permissionId', 'name');
  return rps.map((rp) => rp.permissionId?.name).filter(Boolean);
}

/**
 * Get multiple roles with their permissions (batch)
 * @param {ObjectId[]} roleIds
 * @returns {Promise<Map<string, string[]>>} roleId -> permission names
 */
async function getPermissionsForRoles(roleIds) {
  if (!roleIds?.length) return new Map();
  const rps = await RolePermission.find({ roleId: { $in: roleIds } })
    .populate('permissionId', 'name')
    .lean();
  const map = new Map();
  roleIds.forEach((id) => map.set(id.toString(), []));
  rps.forEach((rp) => {
    const id = rp.roleId.toString();
    if (rp.permissionId?.name) {
      map.get(id).push(rp.permissionId.name);
    }
  });
  return map;
}

/**
 * Sync role_has_permissions for a role (replace all)
 * @param {ObjectId} roleId
 * @param {string[]} permissionNames - permission names (e.g. users.show)
 * @param {string} guard_name
 */
async function syncRolePermissions(roleId, permissionNames, guard_name = 'admin') {
  await RolePermission.deleteMany({ roleId });
  if (!permissionNames?.length) return;
  const permissions = await Permission.find({
    name: { $in: permissionNames },
    guard_name
  }).select('_id');
  const permIds = permissions.map((p) => p._id);
  await RolePermission.insertMany(permIds.map((permissionId) => ({ roleId, permissionId })));
}

module.exports = {
  getPermissionNamesForRole,
  getPermissionsForRoles,
  syncRolePermissions
};
