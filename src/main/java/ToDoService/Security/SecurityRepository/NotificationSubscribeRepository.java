package ToDoService.Security.SecurityRepository;

import ToDoService.Security.SecurityModels.NotificationSubscribe;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository("NotificationSubscribe")
public interface NotificationSubscribeRepository extends CrudRepository<NotificationSubscribe, Integer>{
}
