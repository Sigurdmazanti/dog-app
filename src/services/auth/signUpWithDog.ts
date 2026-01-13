// services/auth/signUpWithDog.ts
import { DogFormValues } from "src/components/forms/add-dog/AddDog.types"
import { signUpWithEmail } from "./auth.service"
import { createDog } from "../dogs/dogs.service"
import { linkDogBreeds } from "../dogs/dogs.breeds.service"

export async function signUpWithDog(
  email: string,
  password: string,
  formData: DogFormValues
) {
  const { user, session } = await signUpWithEmail(email, password)

  if (!user)
    throw new Error("User was not created")

  const dog = await createDog(user.id, formData)
  await linkDogBreeds(dog.id, formData.dogBreed ?? [])

  return {
    user,
    session,
    dog
  }
}
