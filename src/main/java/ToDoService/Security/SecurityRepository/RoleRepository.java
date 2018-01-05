package ToDoService.Security.SecurityRepository;

import ToDoService.Security.SecurityModels.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    Role findByRole(String s);
}
