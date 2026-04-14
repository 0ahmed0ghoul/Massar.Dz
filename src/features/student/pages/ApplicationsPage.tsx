import ApplicationsList from "../applications/ApplicationsList";

const ApplicationsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-white">My Applications</h1>
      <ApplicationsList />
    </div>
  );
};

export default ApplicationsPage;