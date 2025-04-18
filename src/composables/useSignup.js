import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const useSignup = () => {
  const email = ref('');
  const password = ref('');
  const username = ref('');
  const bio = ref('');
  const pdp = ref('');
  const birthday = ref(Date(0));
  const error = ref(null);
  const router = useRouter();

  const register = async () => {
    error.value = null;
    try {
      const auth = getAuth();
      const db = getFirestore();

      // Register the user
      const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
      const user = userCredential.user;

      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: username.value,
      });

      // Add user to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        username: username.value,
        email: email.value,
        bio: bio.value,
        blocked: false,
        pdp: pdp.value ? pdp.value : 'https://i.postimg.cc/05zJ6r52/duck-default.png', 
        birthday: birthday.value,
        createdAt: new Date(),
        role: "user",
      });

      console.log('Registered and user data saved to Firestore.');
      router.push('/');
    } catch (err) {
      console.error('Registration error:', err);
      error.value = err.message;
    }
  };

  return { email, password, username, bio, birthday, error, pdp, register };
};

export default useSignup;
