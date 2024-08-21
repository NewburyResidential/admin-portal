import { roleOptions } from 'src/layouts/dashboard/roleOptions';
import { useFormContext } from 'react-hook-form';
import ReactHookMultiSelect from '../ReactHookMultiSelect';

export default function ReactHookSelectRoles() {
  const { setValue } = useFormContext();

  const handleRoleChange = (event, oldRoles) => {
    const newRoles = event.target.value;
    if (newRoles.includes('admin') && !oldRoles.includes('admin')) {
      setValue('roles', ['admin']);
    } else if (oldRoles.includes('admin') && newRoles.some((val) => val !== 'admin')) {
      const updatedRoles = newRoles.filter((val) => val !== 'admin');
      setValue('roles', updatedRoles);
    } else if (newRoles.length === 0) {
      setValue('roles', ['public']);
    } else {
      const updatedRoles = newRoles.filter((val) => val !== 'public');
      setValue('roles', updatedRoles);
    }
  };

  return <ReactHookMultiSelect label="Roles" name="roles" options={roleOptions} onChange={handleRoleChange} />;
}
