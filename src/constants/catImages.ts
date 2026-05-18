import sogangCat from '@/assets/images/SignUp/sogangCat.png';
import yonseiCat from '@/assets/images/SignUp/yonseiCat.png';
import hongikCat from '@/assets/images/SignUp/hongikCat.png';
import ewhaCat from '@/assets/images/SignUp/ewhaCat.png';
import boogleCat from '@/assets/images/SignUp/boogleCat.png';

const catImageMap: Record<string, string> = {
  SG: sogangCat,
  Y: yonseiCat,
  H: hongikCat,
  E: ewhaCat,
};

export const resolveProfileImage = (profileImageName: string | null): string => {
  if (!profileImageName) return boogleCat;
  return catImageMap[profileImageName] ?? boogleCat;
};
