const ProfileForm = ({
    form,
    updateField,
    saveProfile,
    saving,
  }: any) => {
    return (
      <div className="space-y-3">
        <input
          value={form.first_name}
          onChange={(e) => updateField("first_name", e.target.value)}
          placeholder="First name"
        />
  
        <input
          value={form.last_name}
          onChange={(e) => updateField("last_name", e.target.value)}
          placeholder="Last name"
        />
  
        <button onClick={saveProfile} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    );
  };
  
  export default ProfileForm;