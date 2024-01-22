import getUsersGeneral from "@/app/(actions)/general/getUsers";
import userQueryKeys from "@/lib/queries/users";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

export default function useGetFilteredUsers({ filter }: { filter: string }) {
  const query = useQuery({
    queryKey: userQueryKeys.usersGeneral({ filter }),
    queryFn: () =>
      getUsersGeneral({
        where: {
          username: {
            startsWith: filter,
          },
        },
      }),
    placeholderData: keepPreviousData,
  });
  return query;
}
