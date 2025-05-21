<script setup>
import { ref, onMounted, watch, inject} from 'vue';
import { useUsersStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import { toast } from '@/components/ui/toast';
import PageHeader from '@/components/PageHeader.vue';
import Button from '@/components/ui/button/Button.vue';
import SelectForm from '@/components/common/SelectForm.vue';
import Input from '@/components/ui/input/Input.vue';
import { useAuthStore } from '@/stores/auth.js';
import { useI18n } from 'vue-i18n';


const alertDialog = inject('alertDialog')
const { t } = useI18n();
const storeUser = useUsersStore();
const router = useRouter();
const storeAuth = useAuthStore();

const filters = ref({
  name: '',
  email: '',
  role: ''
});

const users = ref([]);
const pagination = ref({ totalCount: 0, totalPages: 1, page: 1, pageSize: 10 });

const loadUsers = async () => {
  try {
    const { page, pageSize } = pagination.value;
    const data = await storeUser.getAllUsers({
      ...filters.value,
      page,
      pageSize
    });
    console.log(data);
    users.value = data.data;
    Object.assign(pagination.value, data);
  } catch (e) {
    console.error(e);
    toast({ title: t('Error'), description: 'Error loading users', variant: 'destructive' });
  }
};

const changePage = (p) => {
  if (p >= 1 && p <= pagination.value.totalPages) {
    pagination.value.page = p;
    loadUsers();
  }
};

const changeRole = async (userId, role) => {
  try {
    await storeUser.changeRole(userId, role);
    console.log('Role changed');
    await loadUsers();
  } catch (e) {
    console.error('Error changing role:', e);
    toast({ title: t('Error'), description: 'Failed to change role', variant: 'destructive' });
  }
};

const changeRoleConfirmed = (userId, role) => {
  alertDialog.value.open(
        () => changeRole(userId, role),
        t('AreYouSure'), t('Cancel'), "Yes, change",
        "Are you sure you want to change this user's role?", "")
}

watch(filters, () => {
  pagination.value.page = 1;
  loadUsers();
}, { deep: true });

onMounted(() => {
  if (!storeAuth.user) {
    router.push({ name: 'login' });
    return;
  }

  if (storeAuth.user?.roles?.includes('User')) {
    router.push({ name: 'home' });
    return;
  }
  loadUsers();
});
</script>

<template>
  <div class="flex flex-col justify-center items-center py-12 px-5 lg:px-8">
    <PageHeader :title="t('Users')" />

    <div class="grid md:grid-cols-2 gap-4 w-full max-w-4xl my-6 items-end">
      <div class="flex gap-2">
        <Input v-model="filters.name" :placeholder="t('Name')" class="font-semibold !placeholder-gray-500" />
        <Button v-if="filters.name" @click="filters.name = ''" class="w-fit p-3">X</Button>
      </div>
      <div class="flex gap-2">
        <Input v-model="filters.email" :placeholder="t('Email')" class="font-semibold !placeholder-gray-500" />
        <Button v-if="filters.email" @click="filters.email = ''" class="w-fit p-3">X</Button>
      </div>

    </div>
    <div class="flex gap-2 justify-center items-start col-span-2 w-full max-w-lg mb-6">
      <SelectForm v-model="filters.role" :items="storeUser.roles" :placeholder="t('Role')" class="w-full" />
      <Button v-if="filters.role" @click="filters.role = ''" class="w-fit p-3">X</Button>
    </div>

    <div v-if="users?.length > 0" class="w-full">
      <div class="w-full overflow-x-auto">
        <table
          class="min-w-[700px] text-sm mx-auto text-left border text-center bg-white dark:bg-darkSecondary dark:text-white">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th class="py-3 px-6">{{ t('Name') }}</th>
              <th class="py-3 px-6">{{ t('Email') }}</th>
              <th class="py-3 px-6">{{ t('Role') }}</th>
              <th class="py-3 px-6">{{ t('ChangeRole') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="bg-white dark:bg-darkSecondary dark:text-white border-b">
              <td class="py-4 px-2">{{ user.name }}</td>
              <td class="py-4 px-2">{{ user.email }}</td>
              <td class="py-4 px-2">
                <span v-for="role in user.roles" :key="role"
                  class="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-1 mx-1 text-xs">
                  {{ role }}
                </span>
              </td>
              <td class="py-4 px-2 cursor-pointer" @click="changeRoleConfirmed(user.id, user.roles.includes('User') ? 'Admin' : 'User')">
                <svg class="w-6 h-6 text-gray-800 dark:text-white mx-auto" aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                    d="M21 13v-2a1 1 0 0 0-1-1h-.757l-.707-1.707.535-.536a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.536.535L14 4.757V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.757l-1.707.707-.536-.535a1 1 0 0 0-1.414 0L4.929 6.343a1 1 0 0 0 0 1.414l.536.536L4.757 10H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.757l.707 1.707-.535.536a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.536-.535 1.707.707V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.757l1.707-.708.536.536a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-.535-.536.707-1.707H20a1 1 0 0 0 1-1Z" />
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                    d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                </svg>
                <p class="text-sm text-gray-500 dark:text-white">
                  Change to <b>{{ user.roles.includes('User') ? 'Admin' : 'User' }}</b>
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex justify-center items-center flex-wrap gap-5 px-5 mx-auto mt-5 mb-10 max-w-4xl">
        <Button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1">
          {{ t('PreviousPage') }}
        </Button>
        <span class="text-sm dark:text-white text-black">
          {{ t('Page') }} {{ pagination.page }} : {{ pagination.totalPages }} ({{ t('Total') }}: {{
            pagination.totalCount }})
        </span>
        <Button @click="changePage(pagination.page + 1)" :disabled="pagination.page === pagination.totalPages">
          {{ t('NextPage') }}
        </Button>
      </div>
    </div>
    <div v-else class="flex flex-col justify-center items-center mt-5">
      <p class="text-lg text-gray-500 dark:text-white">No users found</p>
    </div>
  </div>
</template>
