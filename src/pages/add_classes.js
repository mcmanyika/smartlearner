import React from 'react';
import AdminLayout from './admin/adminLayout';
import UploadClassNameForm from '../app/components/teachers/UploadClassNameForm';
import withAuth from '../../utils/withAuth';

function AddClasses() {
  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 lg:w-1/3">
          <UploadClassNameForm />
        </div>
        <div className="w-full md:w-1/2 lg:w-4/5 bg-white m-2">
        <div className='text-2xl m-2 p-4'>Notice Board</div>
          <div className="h-3/4 overflow-y-auto">
            
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAuth(AddClasses);
