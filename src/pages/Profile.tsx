const Profile = () => (
  <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
    <div className="glass-card p-8 text-center animate-fade-in-up">
      <div className="w-20 h-20 rounded-full gradient-header flex items-center justify-center text-3xl text-primary-foreground mx-auto mb-4">
        J
      </div>
      <h1 className="font-heading text-2xl font-bold text-foreground">Jordan M.</h1>
      <p className="text-muted-foreground mt-1">Computer Science • Junior • Fall Quarter</p>

      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="bg-secondary rounded-xl p-4">
          <p className="text-2xl font-heading font-bold text-foreground">3.41</p>
          <p className="text-xs text-muted-foreground mt-1">GPA</p>
        </div>
        <div className="bg-secondary rounded-xl p-4">
          <p className="text-2xl font-heading font-bold text-foreground">87</p>
          <p className="text-xs text-muted-foreground mt-1">Credits</p>
        </div>
        <div className="bg-secondary rounded-xl p-4">
          <p className="text-2xl font-heading font-bold text-foreground">W8</p>
          <p className="text-xs text-muted-foreground mt-1">Week</p>
        </div>
      </div>
    </div>

    <div className="text-center mt-8">
      <p className="text-[11px] text-muted-foreground">Powered by Salesforce Agentforce</p>
    </div>
  </div>
);

export default Profile;
