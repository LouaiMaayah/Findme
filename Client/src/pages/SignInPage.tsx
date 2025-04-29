import MapComponent from "../components/MapComponent";
import SignInForm from "../components/ui/SignInForm";

function SignInPage() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <MapComponent>
        <SignInForm />
      </MapComponent>
    </div>
  );
}

export default SignInPage;
