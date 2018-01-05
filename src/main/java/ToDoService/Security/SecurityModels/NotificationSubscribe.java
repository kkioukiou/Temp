package ToDoService.Security.SecurityModels;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "notification_subscribe")
public class NotificationSubscribe implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private int id;
    @Column(name = "endpoint")
    private String endpoint;
    @Column(name = "auth")
    private String auth;
    @Column(name = "[key]")
    private String key;
    @Column(name = "owner")
    private int owner;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public String getAuth() {
        return auth;
    }

    public void setAuth(String auth) {
        this.auth = auth;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public int getOwner() {
        return owner;
    }

    public void setOwner(int owner) {
        this.owner = owner;
    }
}
