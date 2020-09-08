package SEPT.Team.Seven.repo;

import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.stereotype.Component;

import SEPT.Team.Seven.model.Employee;

@Component
public class RestConfig implements RepositoryRestConfigurer {

    @Override
      public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
        config.exposeIdsFor(Employee.class);
        //config.exposeIdsFor(Library.class);
      }

}

