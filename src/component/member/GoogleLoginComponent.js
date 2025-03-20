import { Link } from 'react-router-dom';
import { getGoogleLoginLink } from '../../api/GoogleApi';

const GoogleLoginComponent = () => {
  const link = getGoogleLoginLink();

  return (
    <div className="flex flex-col">
      <div className="text-center text-blue-500">
      </div>
      <div className="flex justify-center  w-full">
        <div className="text-3xl text-center m-6 text-white font-extrabold w-3/4 bg-orange-500 shadow-sm rounded p-2">
          <Link to={link}>Google LOGIN</Link>
        </div>
      </div>
    </div>
  );
};
export default GoogleLoginComponent;
