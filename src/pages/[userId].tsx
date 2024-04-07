import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

interface Category {
  id: number;
  name: string;
  users?: any;
}

const ProtectedPage = () => {
  const router = useRouter();
  const userId = router.query.userId as string;
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 6;
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[] | undefined>([]);
  const [currentCategories, setCurrentCategories] = useState<
    Category[] | undefined
  >([]);

  const userMutationConnect = api.category.connectToUser.useMutation();
  const userMutationDisconnect = api.category.disconnectFromUser.useMutation();

  const categoryFetch = api.category.getAllCategories.useQuery(undefined, {
    enabled: false,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await categoryFetch.refetch();
      setCategories(data);
      setIsLoading(false);
    };
    fetchCategories();
  }, [currentPage]);

  const toggleCategoryStatus = async (
    categoryId: number,
    isSelected: boolean,
  ) => {
    if (isSelected) {
      userMutationDisconnect.mutate({
        id: parseInt(userId, 10),
        category: categoryId,
      });
    } else {
      userMutationConnect.mutate({
        id: parseInt(userId, 10),
        category: categoryId,
      });
    }
    const categoryObject = categories?.find((data) => data.id === categoryId);
    if (categoryObject) {
      const userObject = categoryObject?.users?.findIndex(
        (data: any) => data.id === parseInt(userId, 10),
      );
      if (userObject !== -1) {
        categoryObject.users?.splice(userObject, 1);
      } else {
        categoryObject.users?.push({
          id: parseInt(userId, 10),
        });
      }
    }
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    const categoriesList = categories?.slice(
      indexOfFirstCategory,
      indexOfLastCategory,
    );
    setCurrentCategories(categoriesList);
  }, [currentPage, categories]);

  const isEnabled = (users: any) => {
    return users.some((data: any) => data?.id === parseInt(userId, 10));
  };

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="container mx-auto py-16">
        <div className="mx-auto max-w-lg">
          <div className="mb-8 flex justify-between">
            <h1 className="text-3xl font-bold text-white">
              Please mark your interest
            </h1>
            <button
              onClick={handleLogout}
              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
          {isLoading && (
            <>
              <h3 style={{ color: "white" }}>
                Loading categories. Please wait...
              </h3>
            </>
          )}
          <ul>
            {currentCategories?.map((category: any) => (
              <li
                key={category.id}
                className="flex items-center justify-between py-2"
              >
                <span className="text-white">{category.name}</span>
                <>
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    checked={isEnabled(category.users)}
                    onChange={() =>
                      toggleCategoryStatus(
                        category.id,
                        isEnabled(category.users),
                      )
                    }
                    className="mr-2 h-6 w-6"
                  />
                </>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            {categories &&
              Array.from(
                { length: Math.ceil(categories?.length / categoriesPerPage) },
                (_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`mr-2 rounded px-3 py-1 ${
                      currentPage === index + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-600 text-white hover:bg-gray-700"
                    }`}
                  >
                    {index + 1}
                  </button>
                ),
              )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProtectedPage;
