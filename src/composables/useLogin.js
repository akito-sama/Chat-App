import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const useLogin = () => {
  const email = ref('');
  const password = ref('');
  const error = ref(null);
  const router = useRouter();

  const login = async () => {
    error.value = null;
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email.value, password.value);
      console.log('Logged in successfully');
      router.push('/');
    } catch (err) {
      console.error('Login error:', err);
      error.value = err.message;
    }
  };

  return { email, password, error, login };
};

export default useLogin;