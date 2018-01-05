package ToDoService.Security.SecurityService;

import ToDoService.Security.SecurityModels.Role;
import ToDoService.Security.SecurityModels.User;
import ToDoService.Security.SecurityRepository.UserRepository;
import ToDoService.Security.SecurityRepository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service("customUserDetailsService")
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Autowired
    public CustomUserDetailsService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {

        User user = userRepository.findByEmail(s);
        if (null == user){
            throw new UsernameNotFoundException("No user present with username " + s);
        } else {
            List<String> userRoles = new ArrayList<>();
            for (Role role : user.getRoles()){
                userRoles.add(role.getRole());
            }
            return new CustomUserDetail(user, userRoles);
        }
    }
}
