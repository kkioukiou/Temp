package ToDoService.Security.SecurityRepository;

import ToDoService.Security.SecurityModels.Role;
import ToDoService.Security.SecurityModels.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;



@Service
public class UserServiceImpl{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void saveUser(User user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        user.setActive(true);
        user.setRole(roleRepository.findByRole("ADMIN"));
        System.out.println(user.toString());
        userRepository.save(user);
    }
}
