const ProfileSummary = ({ form }: any) => {
    return (
      <div className="p-4 border rounded">
        <p className="text-white">
          {form.first_name} {form.last_name}
        </p>
        <p className="text-white/40">{form.email}</p>
      </div>
    );
  };
  
  export default ProfileSummary;